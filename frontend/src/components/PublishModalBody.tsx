import React, { useCallback } from "react";
import { ContextModalProps } from "@mantine/modals";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

const PublishModalBody = ({
  context,
  id,
  innerProps
}: ContextModalProps<{
  modalBody: string;
  onConfirm: () => void;
  confirmLabel: string;
  isDisabled: boolean;
}>) => {
  const onBackClickCallback = useCallback(() => context.closeModal(id), [context, id]);
  const onActionCallback = useCallback(() => {
    context.closeModal(id);
    innerProps.onConfirm();
  }, [context, id, innerProps]);

  return (
    <div className="flex flex-col gap-20">
      <ErrorMessage classname="text-2xl font-medium">{innerProps.modalBody}</ErrorMessage>
      <div className="flex flex-row gap-4 self-end">
        <Button theme="dark" onClick={onBackClickCallback}>
          Back
        </Button>
        <Button data-testid="confirmButton" theme="secondary" onClick={onActionCallback}>
          {innerProps.confirmLabel}
        </Button>
      </div>
    </div>
  );
};

export default PublishModalBody;
