import { Form } from "@remix-run/react";
import type { ActionFunction } from "remix";
import { UploadHandler } from "@remix-run/node/formData";
import { parseMultipartFormData } from "@remix-run/node/parseMultipartFormData";

const uploadHandler: UploadHandler = async ({ name, stream, filename }) => {
  try {
    if (name !== "documents") {
      stream.resume();
      return;
    }

    console.log("before for...of", name, filename);
    const chunks = [];
    for await (const chunk of stream) {
      console.log("inside for...of");
      chunks.push(chunk);
    }
    console.log("after for...of");
    const buffer = Buffer.concat(chunks);

    return "it worked";
  } catch (e) {
    console.log(e);
    return "it did not worked";
  }
};

export const action: ActionFunction = async ({ request }) => {
  console.log("im at the action");
  const body = await parseMultipartFormData(request, uploadHandler);

  console.log("body", body);
};

export default function Index() {
  return (
    <div className="remix__page">
      <Form method="post" encType="multipart/form-data">
        <input name="documents" type="file" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
