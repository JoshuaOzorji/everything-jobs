defineField({
name: "slug",
title: "Slug",
type: "slug",
options: {
source: async (
doc: SanityDocument,
options,
) => {
if (doc.slug?.current)
return doc.slug.current;

    				const client = options.getClient({
    					apiVersion: "2025-02-02",
    				});
    				const [company, jobType] =
    					await Promise.all([
    						client.fetch(
    							`*[_type == "company" && _id == $id][0]`,
    							{
    								id: doc
    									.company
    									._ref,
    							},
    						),
    						client.fetch(
    							`*[_type == "jobType" && _id == $id][0]`,
    							{
    								id: doc
    									.jobType
    									._ref,
    							},
    						),
    					]);

    				return `${doc.title}-${company.name}-${jobType.name}`
    					.toLowerCase()
    					.replace(/\s+/g, "-")
    					.replace(/[^\w-]+/g, "");
    			},
    		},
    		description:
    			"This field will become read-only after the job is published",
    		readOnly: ({ document }) =>
    			Boolean(document?.publishedAt),
    		validation: (Rule) =>
    			Rule.required().custom(
    				async (slug, context) => {
    					if (!slug?.current) return true;

    					const existing = await context
    						.getClient({
    							apiVersion: "2025-02-02",
    						})
    						.fetch(
    							`*[_type == "job" && slug.current == $slug && _id != $id][0]`,
    							{
    								slug: slug.current,
    								id:
    									context
    										.document
    										?._id ??
    									"",
    							},
    						);

    					return existing
    						? "A job with this slug already exists."
    						: true;
    				},
    			),
    	}),
