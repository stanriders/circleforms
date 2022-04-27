import { FiUser } from "react-icons/fi"

export default function FormEntrySkeleton() {
  return (
    <div className="skeleton flex justify-end items-center rounded-5 bg-grey-skeleton h-20 p-5">
      <div className="h-10 w-10 rounded-full flex items-center justify-center">
        <FiUser className="text-white h-4 w-4" />
      </div>
    </div>
  )
}
