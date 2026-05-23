type Props = {
    showFilter: boolean;

    selectedRatings: string[];
    toggleRating: (rating: string) => void;

    sortBy: string;
    setSortBy: (value: string) => void;

    setCurrentPage: (page: number) => void;

    setShowFilter: (value: boolean) => void;
};

export default function MovieFilter({
    showFilter,
    selectedRatings,
    toggleRating,
    sortBy,
    setSortBy,
    setCurrentPage,
    setShowFilter,
}: Props) {
    if (!showFilter) return null;

    return (
        <div className="filter-panel">
            <div className="filter-section">
                <h3>Rating</h3>

                <label className="rating-sort">
                    <input
                        type="checkbox"
                        checked={selectedRatings.length === 0}
                        onChange={() => {
                            toggleRating("all");
                            setCurrentPage(1);
                        }}
                    />
                    All
                </label>

                {["G", "PG", "M", "MA", "R"].map((rating) => (
                    <label key={rating} className="rating-sort">
                        <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating)}
                            onChange={() => {
                                toggleRating(rating);
                                setCurrentPage(1);
                            }}
                        />
                        {rating}
                    </label>
                ))}
            </div>

            <div className="filter-divider"></div>

            <div className="filter-section">
                <h3>Sort By</h3>

                <button
                    className={sortBy === "newest" ? "active-sort" : ""}
                    onClick={() => {
                        setSortBy("newest");
                        setCurrentPage(1);
                        setShowFilter(false);
                    }}
                >
                    Newest
                </button>

                <button
                    className={sortBy === "oldest" ? "active-sort" : ""}
                    onClick={() => {
                        setSortBy("oldest");
                        setCurrentPage(1);
                        setShowFilter(false);
                    }}
                >
                    Oldest
                </button>

                <button
                    className={sortBy === "az" ? "active-sort" : ""}
                    onClick={() => {
                        setSortBy("az");
                        setCurrentPage(1);
                        setShowFilter(false);
                    }}
                >
                    A to Z
                </button>

                <button
                    className={sortBy === "za" ? "active-sort" : ""}
                    onClick={() => {
                        setSortBy("za");
                        setCurrentPage(1);
                        setShowFilter(false);
                    }}
                >
                    Z to A
                </button>
            </div>
        </div>
    );
}
