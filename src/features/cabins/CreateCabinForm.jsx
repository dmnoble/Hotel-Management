import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();
  const isWorking = isCreating || isEditing;

  // Pull out id and existing image separately so we can reuse the image
  const { id: editId, image: existingImage, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  // TODO: point this to a real image file you have in the project
  const PLACEHOLDER_IMAGE = "/img/chambers/placeholder.jpg";

  function onSubmit(data) {
    // We currently don't support real file uploads in local mode,
    // so ignore the file field and use a string instead.
    // Strip the form's "image" field from data
    const { image: _unusedImageField, ...rest } = data;

    let finalImage;

    if (isEditSession) {
      // For edits, keep whatever image the chamber already had (if any)
      if (typeof existingImage === "string" && existingImage) {
        finalImage = existingImage;
      } else {
        finalImage = PLACEHOLDER_IMAGE;
      }
    } else {
      // For new chambers, always use a placeholder path for now
      finalImage = PLACEHOLDER_IMAGE;
    }

    const newCabinPayload = {
      ...rest,
      image: finalImage,
    };

    if (isEditSession)
      editCabin(
        { newCabinData: newCabinPayload, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createCabin(newCabinPayload, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Chamber name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Nightly rate" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for ledger & brochure"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Chamber portrait">
        {/* File input is currently cosmetic; real upload will be a future phase */}
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            // no required rule for now, since we always set a placeholder
            required: false,
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Update chamber" : "Create new chamber"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
