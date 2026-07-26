SELECT
  COUNT(DISTINCT session_hash) AS users,
  COUNT(DISTINCT CASE WHEN name = 'workplace_added' THEN session_hash END) AS workplace_added,
  COUNT(DISTINCT CASE WHEN name = 'shift_added' THEN session_hash END) AS shift_added,
  COUNT(DISTINCT CASE WHEN name = 'month_ready' THEN session_hash END) AS month_ready,
  COUNT(DISTINCT CASE WHEN name = 'exported' THEN session_hash END) AS exported,
  COUNT(DISTINCT CASE WHEN name = 'returned' THEN session_hash END) AS returned,
  COUNT(DISTINCT CASE WHEN occurred_on >= date('now', '-6 days') THEN session_hash END) AS users_7d,
  COUNT(DISTINCT CASE WHEN name = 'month_ready' AND occurred_on >= date('now', '-6 days') THEN session_hash END) AS month_ready_7d
FROM product_events;
