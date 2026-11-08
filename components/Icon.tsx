import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp02Icon,
  Bookmark02Icon,
  Cancel01Icon,
  Door01Icon,
  FavouriteIcon,
  Flag02Icon,
  Globe02Icon,
  LinkSquare02Icon,
  MoreHorizontalCircle01Icon,
  Search01Icon,
  Share08Icon,
  SparklesIcon,
  Tick02Icon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
const icons = {
  plus: Add01Icon,
  arrowLeft: ArrowLeft01Icon,
  arrowRight: ArrowRight01Icon,
  arrowUp: ArrowUp02Icon,
  bookmark: Bookmark02Icon,
  close: Cancel01Icon,
  door: Door01Icon,
  heart: FavouriteIcon,
  flag: Flag02Icon,
  globe: Globe02Icon,
  external: LinkSquare02Icon,
  moreCircle: MoreHorizontalCircle01Icon,
  search: Search01Icon,
  share: Share08Icon,
  sparkle: SparklesIcon,
  check: Tick02Icon,
  userCircle: UserCircleIcon,
  users: UserGroupIcon,
  user: UserIcon,
};
export default function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <HugeiconsIcon
      icon={icons[name]}
      className="icon"
      size={24.5}
      strokeWidth={1.6}
      aria-hidden="true"
    />
  );
}
