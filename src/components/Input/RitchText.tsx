import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef
} from "mui-tiptap";
import { useRef } from "react";
import Label from "./Label";

interface IRitchText {
  onChange?: (_e: string | undefined) => void;
  value?: string;
  label?: string;
  isRequired?: boolean;
}

const RitchText = ({
  onChange,
  value,
  label = "",
  isRequired = false
}: IRitchText) => {
  const rteRef = useRef<RichTextEditorRef>(null);

  return (
    <>
      <Label required={isRequired}>{label}</Label>
      <RichTextEditor
        ref={rteRef}
        extensions={[StarterKit]}
        content={value}
        onUpdate={({ editor }) => {
          onChange && onChange(editor?.getHTML() as any);
        }}
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonBulletedList />
          </MenuControlsContainer>
        )}
      />
    </>
  );
};

export default RitchText;
