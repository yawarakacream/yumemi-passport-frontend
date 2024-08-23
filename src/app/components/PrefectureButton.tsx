import { memo, useCallback } from "react";

import BasicButton from "@/components/BasicButton";

interface Props {
  prefCode: number;
  prefName: string;
  prefColor: string;
  checked: boolean;
  onClick?: (prefCode: number) => void;
}

export default memo(function PrefectureButton({
  prefCode,
  prefName,
  prefColor,
  checked,
  onClick: onClick_,
}: Props) {
  const onClick = useCallback(() => {
    onClick_?.(prefCode);
  }, [onClick_, prefCode]);

  return (
    <BasicButton onClick={onClick} background={checked ? prefColor : "white"}>
      {prefName}
    </BasicButton>
  );
});
