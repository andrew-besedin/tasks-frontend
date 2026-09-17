import { Link } from "react-router";

export const NotFound: React.FC = () => {
  return (
    <main>
      <h1>Page Not Found.</h1>
      <Link className="back-link" to="/">&larr; Back to task list</Link>
    </main>
  )
}