import React, { FunctionComponent } from "react";
import { Button, ButtonProps } from "@/components/atoms/Button";
import { MoreVertical } from "lucide-react";

/**
 * @description Wraps {@link MoreVertical} with a {@link Button} component and applies default
 * styling.
 * @param props
 * @constructor
 */
export const EllipsisButton: FunctionComponent<ButtonProps> = props => {
  return (
    <Button size={`lg`} variant={`default`} square {...props}>
      <MoreVertical />
    </Button>
  );
};
