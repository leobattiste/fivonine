import L from "@/components/L";
import { formatDate, formatDateFr } from "@/lib/data";
import type { HistEvent } from "@/lib/types";

/** A moment's date in both languages. */
export const dateNode = (e: HistEvent) => <L en={formatDate(e)} fr={formatDateFr(e)} />;
