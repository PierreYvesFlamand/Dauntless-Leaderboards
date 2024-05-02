-- Get season all rows (.csv / flourish)
SELECT gli.last_updated, g.name, g.tag, glig.`level`, glig.remaining_sec 
FROM gauntlet_leaderboard_items gli
LEFT JOIN gauntlet_leaderboard_items_guilds glig ON glig.gauntlet_leaderboard_item_id = gli.id
LEFT JOIN guilds g ON glig.guild_id = g.id
WHERE gli.gauntlet_season = 12
ORDER BY gli.last_updated ASC, glig.`level` DESC, glig.remaining_sec ASC

-- Get trial info
SELECT tw.week, tw.start_at, tw.end_at, tli.last_updated
FROM trial_weeks tw
LEFT JOIN trial_leaderboard_items tli ON tli.trial_week = tw.week
WHERE tw.week = (
	SELECT MAX(tw.week)
	FROM trial_weeks tw
    WHERE tw.week = tw.week -- Change here for specific id
) AND tli.last_updated = (
    SELECT MAX(last_updated)
    FROM trial_leaderboard_items tli
    WHERE tli.trial_week = (
        SELECT MAX(tw.week)
        FROM trial_weeks tw
        WHERE tw.week = tw.week -- Change here for specific id
    )
)

-- Get trial leaderboard
SELECT tlip.rank, tlip.completion_time, tlip.weapon_id, tlip.role_id, tlip.player_id, pn.name, pd.icon_filename, tlip.platform_id
FROM trial_leaderboard_items tli
LEFT JOIN trial_leaderboard_items_players tlip ON tlip.trial_leaderboard_item_id = tli.id
LEFT JOIN trial_leaderboard_item_type tlit ON tlit.id = tlip.trial_leaderboard_item_type_id
LEFT JOIN players p ON p.id = tlip.player_id
LEFT JOIN player_names pn ON pn.player_id = p.id AND pn.platform_id = tlip.platform_id
LEFT JOIN players_data pd ON pd.player_id = p.id
WHERE tli.trial_week = tli.trial_week AND tlit.id = 1 AND tli.last_updated = ( -- Change here for specific id
    SELECT MAX(tli.last_updated)
    FROM trial_leaderboard_items tli
    WHERE tli.trial_week = tli.trial_week -- Change here for specific id
)
ORDER BY tlip.`rank` ASC