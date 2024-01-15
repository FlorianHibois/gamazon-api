interface MimeTypes
{
	[key: string]: string;
}

export class MimeType
{
	public static mime_type: Map<string, string>;

	public static mime_types: MimeTypes = {
		"image/jpg" : "jpg",
		"image/jpeg": "jpeg",
		"image/png" : "png"
	}


	public static init(): void
	{
		MimeType.mime_type.set("image/jpg", "jpg");
		MimeType.mime_type.set("image/jpeg", "jpeg");
		MimeType.mime_type.set("image/png", "png");
	}
}
