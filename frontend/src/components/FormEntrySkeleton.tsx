import { FiUser } from "react-icons/fi";

export default function FormEntrySkeleton() {
  return (
    <div className="flex justify-end items-center p-5 h-20 bg-grey-skeleton rounded-5 skeleton">
      <div className="flex justify-center items-center w-10 h-10 rounded-full">
        <FiUser className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}
