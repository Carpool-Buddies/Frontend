import dayjs from "dayjs";


export const dateSort = (a, b) => {
    const dateA = dayjs(a._departure_datetime);
    const dateB = dayjs(b._departure_datetime);

    // Compare the dates
    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    return 0;


}