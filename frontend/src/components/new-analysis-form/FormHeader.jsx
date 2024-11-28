import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FormHeader({ confirmCloseOpen, formStep }) {
  return (
    <DialogHeader>
      {confirmCloseOpen ? (
        <>
          <DialogTitle>Are you sure you want to close?</DialogTitle>
          <DialogDescription>
            If you close this form, you'll lose all entered data. Is that what
            you want to do?
          </DialogDescription>
        </>
      ) : formStep == 3 ? (
        <></>
      ) : (
        <>
          <DialogTitle>Create Analysis</DialogTitle>
          <DialogDescription>
            Follow these steps to create a new analysis
          </DialogDescription>
        </>
      )}
    </DialogHeader>
  );
}
