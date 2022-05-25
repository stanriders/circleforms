import { useFormData } from "./FormContext";
import ImageDropzone from "./ImageDropzone";

const DesignTab = () => {
  const { setValues } = useFormData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-8 gap-x-24">
      <div className="lg:col-span-2">
        <ImageDropzone
          classname="aspect-square"
          headingText="Icon"
          name="icon"
          fileAcceptCallback={setValues}
        />
      </div>
      <div className="lg:col-span-4">
        <ImageDropzone headingText="Banner" name="banner" fileAcceptCallback={setValues} />
      </div>
    </div>
  );
};

export default DesignTab;
