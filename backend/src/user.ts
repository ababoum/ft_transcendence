export class User {
    nickname: string;
    avatar: ImageBitmap;

	constructor(name?: string) {
		this.nickname = name;
	}

	setNickname(name: string) {
		this.nickname = name;
	}

	setAvatar(img: ImageBitmap) {
		this.avatar = img;
	}
}