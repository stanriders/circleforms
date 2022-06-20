import { useModals } from "@mantine/modals";

interface IConfirmModal {
  title: string;
  bodyText: string;
  confirmButtonLabel: string;
  confirmCallback: (args: any) => void;
}

const CustomConfirmModal = ({
  title,
  bodyText,
  confirmCallback,

  confirmButtonLabel
}: IConfirmModal) => {
  const modals = useModals();
  return (callbackArg: any) =>
    modals.openContextModal("publish", {
      centered: true,
      title: title,
      innerProps: {
        modalBody: bodyText,
        // this will probably break with many args, but im not sure how to type it
        onConfirm: () => (callbackArg ? confirmCallback(callbackArg) : confirmCallback),
        confirmLabel: confirmButtonLabel
      },
      styles: {
        modal: {
          borderRadius: "55px",
          display: "flex",
          flexDirection: "column",
          flexBasis: " 750px"
        },
        header: {
          paddingTop: "22px",
          paddingLeft: "22px"
        },
        title: {
          fontSize: "2rem"
        },

        body: {
          padding: "22px",
          paddingTop: "0px"
        },
        close: {
          display: "none"
        }
      }
    });
};

export default CustomConfirmModal;
