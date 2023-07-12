export type connection ={
  tutor: string|null;
  student: string|null;
}

export type message ={
  connection: string;
  sender: string;
  receiver: string;
  text: string;
}
