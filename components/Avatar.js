import * as RadixAvatar from "@radix-ui/react-avatar";
import styled from "@emotion/styled";

export default function Avatar({ imageUrl, fallback }) {
  return (
    <AvatarWrapper>
      {imageUrl && <AvatarImage src={imageUrl} />}
      {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
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
