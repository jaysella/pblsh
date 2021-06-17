import { useFaunaUser } from "../hooks/useFaunaUser";
import * as RadixAvatar from "@radix-ui/react-avatar";
import styled from "@emotion/styled";
import { getInitials } from "../helpers/utilities";

export default function Avatar() {
  const { faunaUserData } = useFaunaUser();

  return (
    <AvatarWrapper>
      <AvatarImage src={faunaUserData?.avatar} />
      {faunaUserData && (
        <AvatarFallback>{getInitials(faunaUserData?.name)}</AvatarFallback>
      )}
    </AvatarWrapper>
  );
}

const AvatarWrapper = styled(RadixAvatar.Root)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;
  width: 42px;
  height: 42px;
  border-radius: var(--base-border-radius);
`;

const AvatarImage = styled(RadixAvatar.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled(RadixAvatar.Fallback)`
  padding-top: 1px;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-white-muted);
  color: var(--color-black);
`;
