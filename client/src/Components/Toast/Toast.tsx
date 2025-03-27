type Prop = {
  message: string;
};

export function Msg({ message }: Prop) {
  return <div>{message}</div>;
}
