import { MdContentCopy, MdDeleteOutline, MdMoreVert } from "react-icons/md";
import ReactSelect from "react-select";
import { QUESTIONS_ICONS, QUESTIONS_TYPES } from "./FieldArray";
import Switch from "react-switch";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

const QuestionFooter = ({
  onEditQuestionType,
  onEditQuestionOptional,
  type,
  onDuplicate,
  onRemove,
  isOptional,
  control,
  nestIndex
}) => {
  const t = useTranslations();
  const Icon = QUESTIONS_ICONS[type];
  // t(`inputs.${type}`);
  const options = QUESTIONS_TYPES.map((type) => ({
    value: type,
    label: (
      <div>
        <Icon />
        text
      </div>
    )
  }));

  return (
    <div className="flex justify-between border-t-2 border-white border-opacity-5 pt-4 mt-14">
      {/* <Select
        onChange={onEditQuestionType}
        Icon={Icon}
        defaultValue={type}
        options={QUESTIONS_TYPES.map((type) => ({
          value: type,
          label: t(`inputs.${type}`)
        }))}
      /> */}

      <Controller
        name={`test.${nestIndex}.type`}
        control={control}
        render={({ field }) => <ReactSelect {...field} options={options} />}
      />

      <div className="flex gap-x-2">
        <button onClick={onDuplicate} className="button--icon">
          <MdContentCopy className="h-8 w-8" />
        </button>
        <button onClick={onRemove} className="button--icon mr-4">
          <span className="sr-only">{t("removeQuestion")}</span>
          <MdDeleteOutline className="h-8 w-8" />
        </button>
        <label className="flex items-center gap-x-4 text-2xl font-medium border-l-2 border-white border-opacity-5 pl-8">
          <span>Required</span>
          <Switch
            // onChange={(e) => onEditQuestionOptional(!e)}
            onChange={() => {}}
            checked={!isOptional}
            offColor="#0c0c0c"
            onColor="#0c0c0c"
            onHandleColor="#FF66AA"
            handleDiameter={26}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={32}
            width={58}
            className="border-[2px] border-current"
          />
        </label>
        <button className="button--icon">
          <MdMoreVert className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default QuestionFooter;
