import pandas as pd
import matplotlib.pyplot as plt
# --- AnalysisReport ---
def language_movies_merge(languages_df, movies_df):
    languages_movies_df = pd.merge(
        movies_df[['id', 'date']],
        languages_df[['id', 'language']],
        on='id',
        how='inner')
    return languages_movies_df

def countries_movies_merge(countries_df, movies_df):
    countries_movies_df = pd.merge(
        movies_df[['id', 'name']],
        countries_df[['id', 'country']],
        on='id',
        how='inner')
    return countries_movies_df

def genres_movies_merge(genres_df, movies_df):
    genres_movies_df = pd.merge(
        movies_df[['id', 'name', 'date']],
        genres_df[['id', 'genre']],
        on='id',
        how='inner')
    return genres_movies_df

def countries_oscar_merge(countries_df, oscar_df):
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'], how='all')
    countries_wins_merged_df = pd.merge(
        countries_df[['name', 'country']],
        temp_oscar_df[['film','winner']],
        left_on='name',
        right_on='film')
    return countries_wins_merged_df

def countries_reviews_merge(countries_df, reviews_df):
    # Dropping the entries with null `movie_title` or 'review_score' values
    temp_reviews_df = reviews_df.dropna(subset=['movie_title', 'normalized_score'], how='any')

    countries_merged_df = pd.merge(
        countries_df[['name', 'country']],
        temp_reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title')
    return countries_merged_df

def genres_oscar_merge(genres_movies_df, oscar_df):
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'])

    genres_merged_df = pd.merge(
        genres_movies_df[['name', 'genre']],
        temp_oscar_df[['film', 'winner']],
        left_on='name',
        right_on='film')
    return genres_merged_df

def nom_win_number(genres_oscar_df):
    # Count each row as a nomination
    genres_oscar_df['nominations'] = 1
    # Count wins
    genres_oscar_df['wins'] = genres_oscar_df['winner'].astype(int)

    # Group by genre and sum nominations and wins
    genre_stats_df = genres_oscar_df.groupby('genre').agg(
        Nominations=('nominations', 'sum'),
        Wins=('wins', 'sum')
    ).reset_index()
    return genre_stats_df

def genres_reviews_merge(genres_df, reviews_df):
    genres_reviews_df = pd.merge(
        genres_df,
        reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title',
        how='inner')
    return genres_reviews_df

def genres_countries_merge(genres_movies_df, countries_df):
    genres_countries_df = pd.merge(
        genres_movies_df,
        countries_df,
        on='id',
        how='inner')
    return genres_countries_df

def pivot_count_gen(genres_countries_df, reviews_df):
    # Selecting only the top 20 countries by number of films
    top_20_countries = genres_countries_df['country'].value_counts().nlargest(20).index
    filtered_df = genres_countries_df[genres_countries_df['country'].isin(top_20_countries)]

    final_filtered_df = pd.merge(
        filtered_df,
        reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title',
        how='inner')

    countries_grouped = (
        final_filtered_df
        .groupby(['country', 'genre'])['normalized_score']
        .mean()
        .reset_index()
    )
    # Pivot for heatmap
    pivot_df = countries_grouped.pivot(index='country', columns='genre', values='normalized_score')
    return pivot_df

#####FAI PRIMA OSCAR E MOVIES
def oscar_reviews_merge(movies_df, oscar_df, reviews_df):
    temp_oscar_df = oscar_df.dropna(subset=['film'])
    reviews_merged_df = pd.merge(
        reviews_df[['movie_title', 'normalized_score']],
        temp_oscar_df[['film', 'winner']],
        left_on='movie_title',
        right_on='film')
    return reviews_merged_df



# --- Visualisation ---
#Define the main palette we used in the visualisation file
def color_palette(df):
    cmap = plt.colormaps.get_cmap('viridis')
    colors = [cmap(i / len(df)) for i in range(len(df))]
    return colors


def top15_language_trend(languages_df):
    top15_languages = languages_df['language'].value_counts().head(15).index

    filtered_df = languages_df.loc[languages_df['language'].isin(top15_languages)].copy()
    filtered_df.loc[:, 'year'] = filtered_df['date'].dt.year

    #Group by year and language, count the number of films
    lang_usage = filtered_df.groupby(['year', 'language']).size().reset_index(name='film_count')
    return lang_usage