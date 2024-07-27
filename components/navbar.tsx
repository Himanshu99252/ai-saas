import { UserButton } from "@clerk/nextjs";
// import { getApiLimitCount } from "@/lib/api-limit";
import MobileSidebar from "@/components/mobile-sidebar";
// import { checkSubscription } from "@/lib/subscription";

const Navbar = async () => {
 
  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={0} isPro={false}/>
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
