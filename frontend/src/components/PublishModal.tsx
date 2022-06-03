import React from "react";
import { ContextModalProps } from "@mantine/modals";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

const PublishModal = ({
  context,
  id,
  innerProps
}: ContextModalProps<{ modalBody: string; onConfirm: () => void; confirmLabel: string }>) => {
  return (
    <div className="flex flex-col gap-4">
      <ErrorMessage>{innerProps.modalBody}</ErrorMessage>
      <div className="flex flex-row gap-4 self-end mt-3">
        <Button theme="dark" onClick={() => context.closeModal(id)}>
          Back
        </Button>
        <Button
          theme="secondary"
          onClick={() => {
            context.closeModal(id);
            innerProps.onConfirm();
          }}
        >
          {innerProps.confirmLabel}
        </Button>
      </div>
    </div>
  );
};

export default PublishModal;
