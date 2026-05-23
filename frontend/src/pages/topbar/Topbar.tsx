type Props = {
  role: string;
  onOpenSidebar: () => void;
};

export default function TopBar({ onOpenSidebar }: Props) {
  return (
    <div className="top">
      <div className="top-bar">
        <div className="topbar-button">
          <button onClick={onOpenSidebar}>&#9776;</button>
        </div>

        <div className="movie-logo-box">
          <div className="movie-logo"></div>
          <h1>MovieList</h1>
        </div>
      </div>
    </div>
  );
}
