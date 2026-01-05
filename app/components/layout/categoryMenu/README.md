Static Catalogue Indexing & Path-Based Inheritance
1. The Problem
Pain Point: Traditional e-commerce categories require complex, recursive database queries to handle parent/child relationships (e.g., "Show me all Headphones, including sub-categories").

Impact: These "tree traversal" queries are computationally heavy, causing database bottlenecks and slow response times as the catalogue grows.

2. The Solution
Strategy: Path-Based Prefix Matching. I flattened the entire category tree into a "Virtual File System".

Mechanism: * The Structure: A build-time script generates a static map of all valid paths.

The Fetch: When a user visits /headphones, I don't traverse a tree. I simply fetch all products where the path string starts with headphones.

The Drill-down: Clicking /headphones/earbuds just narrows the prefix string.

Tech Stack: Next.js, Node.js (VFS Generator), Sanity (Groq Prefix Matching).

3. Architecture
Fragment kodu

graph TD
    A[User Click 'Headphones'] -->
    B --> C{Look up Path}
    C -->|Static VFS Map| D[Render UI Slots (Instant)]
    C -->|Database Query| E[Fetch IDs where path startsWith 'headphones']
    E --> F[Return All Child Products]
4. Key Trade-offs
Decision: Pre-computed Paths + Daily Rebuilds VS Dynamic Recursive Queries.

Reasoning: I prioritized Query Efficiency. By treating categories as "file paths" rather than nested nodes, product retrieval becomes a simple string match operation (O(1) complexity). The cost is that moving a category requires a daily rebuild to update the paths, but the benefit is a catalogue that feels instantaneous to the user regardless of depth.