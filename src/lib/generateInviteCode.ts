export function generateInviteCode(length: number = 7): string {
    return [...Array(length)]
        .map(() => "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36)))
        .join("");
} 