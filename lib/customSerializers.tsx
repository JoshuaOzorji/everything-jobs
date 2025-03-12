import {
	PortableTextComponents,
	PortableTextTypeComponentProps,
} from "@portabletext/react";

interface BlockNode {
	_type: string;
	style?: string;
	children: Array<{
		text: string;
		marks?: string[];
		_key: string;
		_type: string;
	}>;
	markDefs: Array<{ _key: string; _type: string; href?: string }>;
}

export const customSerializers: PortableTextComponents = {
	types: {
		block: ({
			value,
		}: PortableTextTypeComponentProps<BlockNode>) => {
			const node = value;

			const renderTextWithMarks = (
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				child: any,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				markDefs: any,
			) => {
				let text = <span>{child.text}</span>;

				// Apply marks to the text
				if (child.marks && child.marks.length > 0) {
					child.marks.forEach((mark: string) => {
						if (mark === "strong") {
							text = (
								<strong>
									{text}
								</strong>
							);
						}
						if (mark === "em") {
							text = <em>{text}</em>;
						}
						if (mark === "link") {
							const linkDef =
								markDefs.find(
									(
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										def: any,
									) =>
										def._key ===
										mark,
								);
							if (linkDef) {
								text = (
									<a
										href={
											linkDef.href
										}
										className='text-blue-500 underline hover:text-blue-700'
										target='_blank'
										rel='noopener noreferrer'>
										{
											text
										}
									</a>
								);
							}
						}
					});
				}

				return text;
			};

			// Render blocks based on their style
			switch (node.style) {
				case "h1":
					return (
						<h1 className='mt-4 text-xl font-bold md:text-2xl'>
							{node.children.map(
								(child, i) => (
									<span
										key={
											i
										}>
										{renderTextWithMarks(
											child,
											node.markDefs,
										)}
									</span>
								),
							)}
						</h1>
					);
				case "h2":
					return (
						<h2 className='mt-4 text-lg font-bold md:text-xl'>
							{node.children.map(
								(child, i) => (
									<span
										key={
											i
										}>
										{renderTextWithMarks(
											child,
											node.markDefs,
										)}
									</span>
								),
							)}
						</h2>
					);
				case "h3":
					return (
						<h3 className='mt-4 text-base font-bold md:text-lg'>
							{node.children.map(
								(child, i) => (
									<span
										key={
											i
										}>
										{renderTextWithMarks(
											child,
											node.markDefs,
										)}
									</span>
								),
							)}
						</h3>
					);
				case "blockquote":
					return (
						<blockquote
							className='mt-4 italic text-gray-700 '
							style={{
								borderLeftWidth:
									"4px",
								borderColor:
									"#D1D5DB",
								marginLeft: "1rem",
								paddingLeft:
									"0.5rem",
								fontStyle: "italic",
							}}>
							{node.children.map(
								(child, i) => (
									<span
										key={
											i
										}>
										{renderTextWithMarks(
											child,
											node.markDefs,
										)}
									</span>
								),
							)}
						</blockquote>
					);
				default:
					return (
						<p className='mt-2 text-sec'>
							{node.children.map(
								(child, i) => (
									<span
										key={
											i
										}>
										{renderTextWithMarks(
											child,
											node.markDefs,
										)}
									</span>
								),
							)}
						</p>
					);
			}
		},
	},

	list: {
		bullet: ({ children }) => {
			return (
				<ul
					className='mb-2 text-gray-700'
					style={{
						listStyleType: "disc",
						listStylePosition: "outside",
						paddingLeft: "0.75",
					}}>
					{children}
				</ul>
			);
		},
	},
	listItem: {
		bullet: ({ children }) => {
			return (
				<li
					className='mb-2 text-gray-700 '
					style={{
						listStyleType: "disc",
						listStylePosition: "inside",
						paddingLeft: "0.75rem",
					}}>
					{children}
				</li>
			);
		},
	},

	marks: {
		em: ({ children }) => <em className='italic'>{children}</em>,
		strong: ({ children }) => (
			<strong className='font-bold'>{children}</strong>
		),
		link: ({ value, children }) => (
			<a
				href={value?.href}
				className='text-blue-500 hover:text-blue-700'
				target='_blank'
				rel='noopener noreferrer'
				style={{
					textDecoration: "underline",
				}}>
				{children}
			</a>
		),
	},
};
