import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-28 w-28">
      <Image
        src={"/assets/images/logo.png"}
        fill
        alt="NextAdmin logo"
        role="presentation"
        priority
      />
    </div>
  );
}
