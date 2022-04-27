import { Fragment } from "react"
import FormEntrySkeleton from "./FormEntrySkeleton"

export default function FormEntrySkeletonList({ length = 10 }) {
  return (
    <Fragment>
      {Array.from({ length }).map((_, index) => (
        <FormEntrySkeleton key={index} />
      ))}
    </Fragment>
  )
}
