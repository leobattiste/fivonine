import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon, Bookmark01Icon, Share08Icon, WhatsappIcon, Copy01Icon, Tick02Icon, Flag01Icon, GlobeIcon, Menu01Icon, Cancel01Icon, UserIcon,
  Notification01Icon, SecurityCheckIcon, Alert02Icon, Camera01Icon, Mic01Icon, QrCodeIcon, PrinterIcon, Location01Icon, Calendar03Icon,
  ArrowRight01Icon, ArrowLeft01Icon, Add01Icon, Delete02Icon, Edit02Icon, CheckmarkBadge01Icon, Mail01Icon, UserGroupIcon,
  Building03Icon, ViewIcon, Settings01Icon, Image01Icon, Clock01Icon, HelpCircleIcon, Link01Icon, StopIcon, ChurchIcon, HandHeartIcon, Home01Icon,
  Book02Icon, FlowerIcon, CharityIcon, Coins01Icon, FavouriteIcon, InformationCircleIcon, WifiOffIcon, Megaphone01Icon,
  ArrowUpRight01Icon, FilterHorizontalIcon, Undo02Icon, Logout01Icon, DashboardSquare01Icon, ArrowDown01Icon, CheckmarkCircle02Icon,
  BookOpen01Icon, Note01Icon, ArrowRight02Icon, MoreHorizontalIcon, LockIcon, File01Icon, CursorMove01Icon, Loading03Icon, SearchRemoveIcon,
} from "@hugeicons/core-free-icons";
const map = {
  search: Search01Icon, bookmark: Bookmark01Icon, share: Share08Icon, whatsapp: WhatsappIcon, copy: Copy01Icon, check: Tick02Icon, flag: Flag01Icon,
  globe: GlobeIcon, menu: Menu01Icon, close: Cancel01Icon, user: UserIcon, bell: Notification01Icon, shield: SecurityCheckIcon, alert: Alert02Icon,
  camera: Camera01Icon, mic: Mic01Icon, qr: QrCodeIcon, print: PrinterIcon, pin: Location01Icon, calendar: Calendar03Icon, right: ArrowRight01Icon,
  left: ArrowLeft01Icon, plus: Add01Icon, trash: Delete02Icon, edit: Edit02Icon, badge: CheckmarkBadge01Icon,
  mail: Mail01Icon, group: UserGroupIcon, building: Building03Icon, eye: ViewIcon, settings: Settings01Icon, image: Image01Icon, clock: Clock01Icon,
  help: HelpCircleIcon, link: Link01Icon, stop: StopIcon, church: ChurchIcon, hand: HandHeartIcon, home: Home01Icon, book: Book02Icon,
  flower: FlowerIcon, charity: CharityIcon, coins: Coins01Icon, heart: FavouriteIcon, info: InformationCircleIcon, wifiOff: WifiOffIcon, megaphone: Megaphone01Icon,
  external: ArrowUpRight01Icon, filter: FilterHorizontalIcon, undo: Undo02Icon, logout: Logout01Icon, dashboard: DashboardSquare01Icon, down: ArrowDown01Icon,
  done: CheckmarkCircle02Icon, guide: BookOpen01Icon, note: Note01Icon, arrow: ArrowRight02Icon, more: MoreHorizontalIcon, lock: LockIcon, file: File01Icon,
  move: CursorMove01Icon, spinner: Loading03Icon, empty: SearchRemoveIcon,
};
export type IconName = keyof typeof map;
export default function Icon({ name, size = 20, className = "icon" }: { name: IconName; size?: number; className?: string }) {
  return <HugeiconsIcon icon={map[name]} size={size} strokeWidth={1.7} aria-hidden="true" className={className} />;
}
export const causeIcon: Record<string, IconName> = { medical: "heart", education: "book", emergency: "alert", funeral: "flower", housing: "home", food: "charity", business: "coins", community: "group", other: "hand" };
