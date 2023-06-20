import { config } from "./config";

export async function getNotificationToSend() {
    const response = await fetch(
        `${config.value.DEV_URL}/api/implappointment/check-reminder`,
        { headers: { "Content-Type": "application/json",
        "x-api-key": config.value.APPTOKEN, } },
    )

    return ((await response.json()) ?? null)
}