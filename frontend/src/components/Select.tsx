import React, { Fragment } from "react";
import { IconType } from "react-icons";
import { AiFillCaretDown } from "react-icons/ai";
import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover} from "@reach/listbox";

interface ISelectProps {
  Icon?: IconType;
  options: { value: string; label: string }[];
  inputValue: string;
  onChange: () => void;
  inputProps: any;
}
const Select = React.forwardRef(
  ({ Icon, options, inputValue, onChange, inputProps }: ISelectProps, ref) => {
    return (
      <ListboxInput ref={ref} {...inputProps}>
        {({ value, valueLabel }) => (
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
);
Select.displayName = "Select";

export default Select;
