
import { useEffect, useMemo, useState } from "react";

type Category =
  | "Food"
  | "Sightseeing"
  | "Shopping"
  | "Relaxation"
  | "Photography";

type Activity = {
  id: number;
  name: string;
  category: Category;
  location: "Airport" | "Outside airport";
  description: string;
  cost: number;
  duration: number;
  airport: string;
};

type Page = "Home" | "Plan" | "Explore" | "Itinerary" | "Saved" | "About";

const activities: Activity[] = [
  {
    id: 1,
    name: "Airport Lounge",
    category: "Relaxation",
    location: "Airport",
    description: "Relax, recharge, and enjoy a comfortable lounge experience.",
    cost: 35,
    duration: 60,
    airport: "All",
  },
  {
    id: 2,
    name: "Local Food Market",
    category: "Food",
    location: "Outside airport",
    description: "Discover local flavors and try something new.",
    cost: 20,
    duration: 90,
    airport: "All",
  },
  {
    id: 3,
    name: "Airport Shopping",
    category: "Shopping",
    location: "Airport",
    description: "Browse local shops, souvenirs, and travel essentials.",
    cost: 15,
    duration: 45,
    airport: "All",
  },
  {
    id: 4,
    name: "City Landmark Walk",
    category: "Sightseeing",
    location: "Outside airport",
    description: "Explore a nearby landmark and experience the city.",
    cost: 10,
    duration: 120,
    airport: "All",
  },
  {
    id: 5,
    name: "Airport Photo Spots",
    category: "Photography",
    location: "Airport",
    description: "Find interesting architecture and capture travel memories.",
    cost: 0,
    duration: 30,
    airport: "All",
  },
  {
    id: 6,
    name: "Airport Café",
    category: "Food",
    location: "Airport",
    description: "Enjoy coffee, snacks, or a relaxed meal before your flight.",
    cost: 18,
    duration: 45,
    airport: "All",
  },
  {
    id: 7,
    name: "Museum Visit",
    category: "Sightseeing",
    location: "Outside airport",
    description: "Spend time exploring art, history, and culture.",
    cost: 25,
    duration: 120,
    airport: "All",
  },
  {
    id: 8,
    name: "Quiet Rest Area",
    category: "Relaxation",
    location: "Airport",
    description: "Take a break in a peaceful space before your next flight.",
    cost: 0,
    duration: 45,
    airport: "All",
  },
  {
    id: 9,
    name: "Local Souvenir Shop",
    category: "Shopping",
    location: "Outside airport",
    description: "Find a memorable item from your destination.",
    cost: 25,
    duration: 60,
    airport: "All",
  },
  {
    id: 10,
    name: "Terminal Architecture Tour",
    category: "Photography",
    location: "Airport",
    description: "Explore interesting spaces and architecture inside the terminal.",
    cost: 0,
    duration: 45,
    airport: "All",
  },
];

const categories: Category[] = [
  "Food",
  "Sightseeing",
  "Shopping",
  "Relaxation",
  "Photography",
];

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours === 0) return `${remaining} min`;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
};

function App() {
  const [page, setPage] = useState<Page>("Home");
  const [airport, setAirport] = useState("");
  const [layoverHours, setLayoverHours] = useState("6");
  const [budget, setBudget] = useState("75");
  const [interests, setInterests] = useState<Category[]>([
    "Food",
    "Sightseeing",
  ]);
  const [allowOutside, setAllowOutside] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [itinerary, setItinerary] = useState<Activity[]>([]);
  const [saved, setSaved] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sidequest-saved") || "[]");
    } catch {
      return [];
    }
  });

  const [returnBuffer, setReturnBuffer] = useState(90);
  const [securityBuffer, setSecurityBuffer] = useState(30);

  useEffect(() => {
    localStorage.setItem("sidequest-saved", JSON.stringify(saved));
  }, [saved]);

  const totalMinutes = Math.max(0, Number(layoverHours) * 60);

  const availableMinutes = Math.max(
    0,
    totalMinutes - returnBuffer - securityBuffer
  );

  const matchingActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesInterest =
        interests.length === 0 || interests.includes(activity.category);

      const matchesBudget = activity.cost <= Number(budget);

      const matchesTime = activity.duration <= availableMinutes;

      const matchesLocation =
        allowOutside || activity.location === "Airport";

      return (
        matchesInterest &&
        matchesBudget &&
        matchesTime &&
        matchesLocation
      );
    });
  }, [interests, budget, availableMinutes, allowOutside]);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(search.toLowerCase()) ||
      activity.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || activity.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleInterest = (category: Category) => {
    setInterests((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const toggleSaved = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const generateItinerary = () => {
    if (!airport.trim()) {
      alert("Please enter your airport or destination.");
      return;
    }

    if (!layoverHours || Number(layoverHours) <= 0) {
      alert("Please enter a valid layover duration.");
      return;
    }

    if (interests.length === 0) {
      alert("Please select at least one interest.");
      return;
    }

    const selected: Activity[] = [];
    let remainingTime = availableMinutes;
    let remainingBudget = Number(budget);

    for (const activity of matchingActivities) {
      if (
        activity.duration <= remainingTime &&
        activity.cost <= remainingBudget
      ) {
        selected.push(activity);
        remainingTime -= activity.duration;
        remainingBudget -= activity.cost;
      }

      if (selected.length >= 3) break;
    }

    setItinerary(selected);
    setGenerated(true);
    setPage("Itinerary");
  };

  const savedActivities = activities.filter((activity) =>
    saved.includes(activity.id)
  );

  const itineraryCost = itinerary.reduce(
    (total, activity) => total + activity.cost,
    0
  );

  const itineraryDuration = itinerary.reduce(
    (total, activity) => total + activity.duration,
    0
  );

  const navItems: Page[] = [
    "Home",
    "Plan",
    "Explore",
    "Itinerary",
    "Saved",
    "About",
  ];

  const navigate = (destination: Page) => {
    setPage(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => (
    <article className="activity-card">
      <div className="activity-top">
        <span className="category-label">{activity.category}</span>
        <button
          className={`save-button ${
            saved.includes(activity.id) ? "is-saved" : ""
          }`}
          onClick={() => toggleSaved(activity.id)}
          aria-label={
            saved.includes(activity.id)
              ? "Remove from saved activities"
              : "Save activity"
          }
        >
          {saved.includes(activity.id) ? "♥" : "♡"}
        </button>
      </div>

      <div className="activity-icon">
        {activity.category === "Food" && "☕"}
        {activity.category === "Sightseeing" && "🏛"}
        {activity.category === "Shopping" && "🛍"}
        {activity.category === "Relaxation" && "☘"}
        {activity.category === "Photography" && "📷"}
      </div>

      <h3>{activity.name}</h3>
      <p>{activity.description}</p>

      <div className="activity-details">
        <span>◷ {formatTime(activity.duration)}</span>
        <span>📍 {activity.location}</span>
      </div>

      <div className="activity-bottom">
        <strong>{activity.cost === 0 ? "Free" : `$${activity.cost}`}</strong>
        <button
          className="text-button"
          onClick={() => {
            if (!itinerary.some((item) => item.id === activity.id)) {
              setItinerary((current) => [...current, activity]);
            }
            navigate("Itinerary");
          }}
        >
          Add to itinerary →
        </button>
      </div>
    </article>
  );

  return (
    <div className="app">
      <header className="navbar">
        <button className="brand" onClick={() => navigate("Home")}>
          <span className="brand-icon">SQ</span>
          <span>
            <strong>side quest</strong>
            <small>MAKE THE MOST OF YOUR LAYOVER</small>
          </span>
        </button>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item}
              className={page === item ? "nav-link active" : "nav-link"}
              onClick={() => navigate(item)}
            >
              {item === "Plan" ? "Plan My Layover" : item}
            </button>
          ))}
        </nav>

        <button className="nav-cta" onClick={() => navigate("Plan")}>
          Start planning →
        </button>
      </header>

      <main>
        {page === "Home" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">YOUR LAYOVER, REIMAGINED</span>
                <h1>
                  Don't just wait.
                  <br />
                  <span>Explore.</span>
                </h1>
                <p>
                  Turn your time between flights into an opportunity.
                  Discover activities, explore new places, and make every
                  layover count.
                </p>
                <div className="hero-actions">
                  <button
                    className="primary-button"
                    onClick={() => navigate("Plan")}
                  >
                    Plan your layover →
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => navigate("Explore")}
                  >
                    Explore activities
                  </button>
                </div>
                <div className="hero-note">
                  Thoughtful plans. Realistic timing. Better layovers.
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-image">
                  <div className="image-caption">
                    <span>YOUR NEXT ADVENTURE</span>
                    <strong>Starts in between.</strong>
                  </div>
                </div>
                <div className="floating-card">
                  <span>✈</span>
                  <div>
                    <strong>Time well spent</strong>
                    <small>Make every hour count</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="intro-section">
              <span className="eyebrow">A BETTER WAY TO TRAVEL</span>
              <h2>Your layover has potential.</h2>
              <p>
                Whether you have a few hours or a longer stop, Side Quest
                helps you find something worth doing without losing sight of
                your next flight.
              </p>

              <div className="benefit-grid">
                <div className="benefit">
                  <span>01</span>
                  <h3>Find your adventure</h3>
                  <p>Discover food, shopping, sightseeing, and more.</p>
                </div>
                <div className="benefit">
                  <span>02</span>
                  <h3>Stay within your time</h3>
                  <p>Plan around your available time and return buffer.</p>
                </div>
                <div className="benefit">
                  <span>03</span>
                  <h3>Make it your own</h3>
                  <p>Build a plan that fits your interests and budget.</p>
                </div>
              </div>
            </section>

            <section className="home-cta">
              <span className="eyebrow">READY FOR A SIDE QUEST?</span>
              <h2>Make your next layover count.</h2>
              <button
                className="primary-button"
                onClick={() => navigate("Plan")}
              >
                Start planning →
              </button>
            </section>
          </>
        )}

        {page === "Plan" && (
          <section className="page-section">
            <div className="page-heading">
              <span className="eyebrow">LET'S GET STARTED</span>
              <h1>Plan your layover.</h1>
              <p>
                Tell us a little about your trip. We'll help you find
                activities that fit your time, budget, and interests.
              </p>
            </div>

            <div className="planner-layout">
              <form
                className="planner-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  generateItinerary();
                }}
              >
                <div className="form-group">
                  <label htmlFor="airport">
                    Airport or destination
                  </label>
                  <input
                    id="airport"
                    type="text"
                    placeholder="e.g. London Heathrow, JFK, Dubai..."
                    value={airport}
                    onChange={(event) => setAirport(event.target.value)}
                    required
                  />
                  <small>
                    For this demo, recommendations use sample activities.
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">How long is your layover?</label>
                  <select
                    id="duration"
                    value={layoverHours}
                    onChange={(event) => setLayoverHours(event.target.value)}
                  >
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours</option>
                    <option value="10">10 hours</option>
                    <option value="12">12 hours</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">What's your budget?</label>
                  <select
                    id="budget"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                  >
                    <option value="0">Free activities only</option>
                    <option value="25">Under $25</option>
                    <option value="50">Under $50</option>
                    <option value="75">Under $75</option>
                    <option value="100">Under $100</option>
                    <option value="200">Under $200</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>What are you interested in?</label>
                  <p className="field-description">
                    Select all that sound interesting.
                  </p>
                  <div className="interest-grid">
                    {categories.map((category) => (
                      <label
                        className={`interest-option ${
                          interests.includes(category) ? "selected" : ""
                        }`}
                        key={category}
                      >
                        <input
                          type="checkbox"
                          checked={interests.includes(category)}
                          onChange={() => toggleInterest(category)}
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={allowOutside}
                      onChange={(event) =>
                        setAllowOutside(event.target.checked)
                      }
                    />
                    I'm comfortable exploring outside the airport.
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="return-buffer">
                    Return-to-gate buffer: {returnBuffer} minutes
                  </label>
                  <input
                    id="return-buffer"
                    type="range"
                    min="30"
                    max="180"
                    step="15"
                    value={returnBuffer}
                    onChange={(event) =>
                      setReturnBuffer(Number(event.target.value))
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="security-buffer">
                    Security and boarding buffer: {securityBuffer} minutes
                  </label>
                  <input
                    id="security-buffer"
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={securityBuffer}
                    onChange={(event) =>
                      setSecurityBuffer(Number(event.target.value))
                    }
                  />
                </div>

                <button type="submit" className="primary-button full-button">
                  Find my activities →
                </button>
              </form>

              <aside className="time-summary">
                <span className="eyebrow">YOUR TIME BREAKDOWN</span>
                <h2>{formatTime(totalMinutes)}</h2>
                <p>Total layover duration</p>
                <div className="time-row">
                  <span>Return buffer</span>
                  <strong>{formatTime(returnBuffer)}</strong>
                </div>
                <div className="time-row">
                  <span>Security and boarding</span>
                  <strong>{formatTime(securityBuffer)}</strong>
                </div>
                <div className="time-row total-row">
                  <span>Time available</span>
                  <strong>{formatTime(availableMinutes)}</strong>
                </div>
                <p className="disclaimer">
                  These are planning estimates, not live airport or flight
                  information. Always confirm your airline's boarding time
                  and airport requirements.
                </p>
              </aside>
            </div>
          </section>
        )}

        {page === "Explore" && (
          <section className="page-section">
            <div className="page-heading">
              <span className="eyebrow">DISCOVER SOMETHING NEW</span>
              <h1>Explore activities.</h1>
              <p>
                Browse ideas for making your time between flights more
                enjoyable.
              </p>
            </div>

            <div className="explore-controls">
              <input
                type="search"
                placeholder="Search activities..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search activities"
              />
              <select
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
                aria-label="Filter by category"
              >
                <option value="All">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <p className="results-count">
              Showing {filteredActivities.length} activities
            </p>

            <div className="activity-grid">
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <p className="empty-message">
                No activities found. Try another search or category.
              </p>
            )}
          </section>
        )}

        {page === "Itinerary" && (
          <section className="page-section">
            <div className="page-heading">
              <span className="eyebrow">YOUR LAYOVER PLAN</span>
              <h1>My itinerary.</h1>
              <p>
                Your selected activities, organized into a simple plan.
              </p>
            </div>

            {generated && (
              <div className="itinerary-summary">
                <span>PLANNING FOR</span>
                <h2>{airport}</h2>
                <p>
                  {layoverHours} hour layover · {formatTime(availableMinutes)}{" "}
                  available
                </p>
              </div>
            )}

            {itinerary.length > 0 ? (
              <>
                <div className="itinerary-list">
                  {itinerary.map((activity, index) => (
                    <div className="itinerary-item" key={activity.id}>
                      <div className="timeline-number">{index + 1}</div>
                      <div className="itinerary-info">
                        <span className="eyebrow">
                          STOP {index + 1} · {activity.category.toUpperCase()}
                        </span>
                        <h3>{activity.name}</h3>
                        <p>{activity.description}</p>
                        <small>
                          {formatTime(activity.duration)} ·{" "}
                          {activity.location}
                        </small>
                      </div>
                      <strong>
                        {activity.cost === 0 ? "Free" : `$${activity.cost}`}
                      </strong>
                      <button
                        className="remove-button"
                        onClick={() =>
                          setItinerary((current) =>
                            current.filter((item) => item.id !== activity.id)
                          )
                        }
                        aria-label={`Remove ${activity.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="itinerary-totals">
                  <div>
                    <span>Estimated activity time</span>
                    <strong>{formatTime(itineraryDuration)}</strong>
                  </div>
                  <div>
                    <span>Estimated total cost</span>
                    <strong>${itineraryCost}</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <h2>Your itinerary is waiting.</h2>
                <p>
                  Start by planning your layover or add activities from the
                  Explore page.
                </p>
                <button
                  className="primary-button"
                  onClick={() => navigate("Plan")}
                >
                  Plan my layover →
                </button>
                <button
                  className="secondary-button"
                  onClick={() => navigate("Explore")}
                >
                  Browse activities
                </button>
              </div>
            )}
          </section>
        )}

        {page === "Saved" && (
          <section className="page-section">
            <div className="page-heading">
              <span className="eyebrow">YOUR FAVORITES</span>
              <h1>Saved activities.</h1>
              <p>
                Keep track of activities you'd like to try on your next
                layover.
              </p>
            </div>

            {savedActivities.length > 0 ? (
              <div className="activity-grid">
                {savedActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>Nothing saved just yet.</h2>
                <p>
                  Browse activities and select the heart to save your
                  favorites.
                </p>
                <button
                  className="primary-button"
                  onClick={() => navigate("Explore")}
                >
                  Explore activities →
                </button>
              </div>
            )}
          </section>
        )}

        {page === "About" && (
          <section className="page-section about-section">
            <span className="eyebrow">THE IDEA BEHIND SIDE QUEST</span>
            <h1>Travel time can be adventure time.</h1>
            <p>
              Side Quest was designed to help travelers make better use of
              their layovers. Instead of spending every hour waiting at the
              gate, travelers can discover activities that fit their
              interests, budget, and available time.
            </p>
            <h2>Our approach</h2>
            <p>
              We believe a good layover plan should be enjoyable but also
              realistic. Side Quest helps users consider their return time,
              security, boarding, and activity duration before building
              their plan.
            </p>
            <button
              className="primary-button"
              onClick={() => navigate("Plan")}
            >
              Plan your next layover →
            </button>
          </section>
        )}
      </main>

      <footer className="footer">
        <button className="footer-brand" onClick={() => navigate("Home")}>
          side quest.
        </button>
        <p>Make the most of the time in between.</p>
        <span>© 2026 Side Quest · A travel planning concept</span>
      </footer>
    </div>
  );
}

export default App;
