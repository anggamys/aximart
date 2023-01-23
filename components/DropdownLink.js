import Link from 'next/link';

export default function DropdownLink(props) {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <div {...rest}>{children}</div>
    </Link>
  );
}
