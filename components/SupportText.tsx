import { supportParts } from "@/lib/domain";
import Icon from "./Icon";
export default function SupportText({
  text,
  campaignId,
}: {
  text: string;
  campaignId?: string;
}) {
  return (
    <div className="support-text">
      {supportParts(text).map((part, i) =>
        part.url ? (
          <a
            key={i}
            href={
              campaignId
                ? `/api/out?campaign=${encodeURIComponent(campaignId)}&url=${encodeURIComponent(part.url)}`
                : part.url
            }
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
          >
            {part.text}
            <Icon name="external" />
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </div>
  );
}
