import { memo, useCallback } from "react";

import BasicButton from "@/components/BasicButton";

interface Props {
  prefCode: number;
  prefName: string;
  checked: boolean;
  onClick?: (prefCode: number) => void;
}

export default memo(function PrefectureButton({
  prefCode,
  prefName,
  checked,
  onClick: onClick_,
}: Props) {
  const onClick = useCallback(() => {
    onClick_?.(prefCode);
  }, [onClick_, prefCode]);

  return (
    <BasicButton onClick={onClick} background={checked ? "pink" : "white"}>
      {prefName}
    </BasicButton>
  );
});
