import { client } from "@/sanity/lib/client";

export async function uploadImageToSanity(file: File) {
	if (!file) return null;

	try {
		const metadata = await client.assets.upload("image", file, {
			filename: file.name,
			contentType: file.type,
		});

		return {
			_type: "image",
			asset: {
				_type: "reference",
				_ref: metadata._id,
			},
			alt: file.name,
		};
	} catch (error) {
		console.error("Image upload error:", error);
		throw new Error("Failed to upload image");
	}
}
