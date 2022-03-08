import { useRouter } from "next/router";

const TicketCode = () => {
  const router = useRouter();

  const { code } = router.query;

  return (
    <div>
      <div>Thank you for your purchase</div>
      <div>Ticket Code: {code}</div>
    </div>
  );
};

export default TicketCode;
