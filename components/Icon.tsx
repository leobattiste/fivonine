import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  FilterHorizontalIcon,
  DashboardSquareIcon,
  Task01Icon,
  Shield01Icon,
  ChartHistogramIcon,
  Settings01Icon,
  File01Icon,
  Building03Icon,
  Mail01Icon,
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
  menu: Menu01Icon,
  filters: FilterHorizontalIcon,
  overview: DashboardSquareIcon,
  reviews: Task01Icon,
  shield: Shield01Icon,
  analytics: ChartHistogramIcon,
  settings: Settings01Icon,
  content: File01Icon,
  organization: Building03Icon,
  mail: Mail01Icon,
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
export type IconName = keyof typeof icons;
export default function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <HugeiconsIcon
      icon={icons[name]}
      className="icon"
      size={20}
      strokeWidth={1.7}
      aria-hidden="true"
    />
  );
}
