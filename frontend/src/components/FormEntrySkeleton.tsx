import { FiUser } from "react-icons/fi";

export default function FormEntrySkeleton() {
  return (
    <div className="skeleton flex h-20 items-center justify-end rounded-5 bg-grey-skeleton p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full">
        <FiUser className="h-4 w-4 text-white" />
      </div>
    </div>
  );
}
