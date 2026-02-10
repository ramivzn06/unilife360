import { streamText } from "ai";
import { models } from "@/lib/ai/providers";
import { createClient } from "@/lib/supabase/server";
import { tutorPrompt } from "@/lib/ai/prompts/tutor";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, courseId } = await req.json();

  let courseData = null;
  let notesContent = "";

  if (courseId) {
    const [courseResult, notesResult] = await Promise.all([
      supabase.from("courses").select("*").eq("id", courseId).single(),
      supabase
        .from("notes")
        .select("plain_text")
        .eq("course_id", courseId)
        .eq("user_id", user.id),
    ]);

    courseData = courseResult.data;
    notesContent =
      notesResult.data?.map((n) => n.plain_text).join("\n\n") || "";
  }

  const systemPrompt = tutorPrompt({
    userName: user.user_metadata?.full_name,
    courseName: courseData?.name,
    courseCode: courseData?.code,
    professor: courseData?.professor,
    notesContent,
  });

  const result = streamText({
    model: models.tutor,
    system: systemPrompt,
    messages,
    temperature: 0.5,
  });

  return result.toTextStreamResponse();
}
