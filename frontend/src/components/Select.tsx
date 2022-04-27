import {
  Listbox,
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption
} from "@reach/listbox";
import { Fragment } from "react";
import { AiFillCaretDown } from "react-icons/ai";

function Select({ Icon, options, defaultValue, onChange }) {
  return (
    <ListboxInput defaultValue={defaultValue} onChange={onChange}>
      {({ value, valueLabel, isExpanded }) => (
        <Fragment>
          <ListboxButton className="inline-flex pl-4 pr-3 py-2">
            <div className="inline-flex items-center gap-x-2">
              {Icon && <Icon className="w-7 h-7" />}
              <span className="text-2xl" data-value={value}>
                {valueLabel}
              </span>
            </div>
            <AiFillCaretDown />
          </ListboxButton>
          <ListboxPopover>
            <ListboxList>
              {options &&
                options.map((option) => (
                  <ListboxOption key={option.value} value={option.value}>
                    {option.label}
                  </ListboxOption>
                ))}
            </ListboxList>
          </ListboxPopover>
        </Fragment>
      )}
    </ListboxInput>
  );
}

export default Select;
