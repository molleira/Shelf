import { useState, useEffect } from "react";
import type { Feed } from "../types";
import { parseMarkdownItems, groupItemsByCategory } from "../helpers/markdown";
import "./feed.css";

export const FeedPage = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);

  useEffect(() => {
    fetch("./feeds.md").then((response) =>
      response
        .text()
        .then((markdown) => setFeeds(parseMarkdownItems(markdown)))
    );
  }, []);

  const groupedFeeds = groupItemsByCategory(feeds);

  return (
    <div>
      {Object.entries(groupedFeeds).map(([category, categoryFeeds]) => (
        <div key={category} className="feed-category">
          <h3 className="category-title">{category}</h3>
          <div className="feeds-grid">
            {categoryFeeds.map((feed, index) => (
              <a
                key={`${category}-${index}`}
                href={feed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="feed-item"
              >
                <div>
                  <h4 className="feed-title">
                    {feed.title}
                    <span className="feed-url">
                      {new URL(feed.url).hostname.replace(/^www\./, "")}
                    </span>
                  </h4>
                </div>
                <p className="feed-description">{feed.description}</p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
