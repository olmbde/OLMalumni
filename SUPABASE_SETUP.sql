-- Create Graduates table
CREATE TABLE IF NOT EXISTS graduates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  promotion INTEGER NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('Science Maths', 'Science Physique', 'Science SVT')),
  university TEXT NOT NULL,
  additional_info TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create simple indexes for faster searches
CREATE INDEX idx_graduates_promotion ON graduates(promotion);
CREATE INDEX idx_graduates_track ON graduates(track);
CREATE INDEX idx_graduates_university ON graduates(university);

-- Enable Row Level Security
ALTER TABLE graduates ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (no authentication needed)
CREATE POLICY "Graduates are viewable by everyone"
ON graduates FOR SELECT
USING (true);

-- Insert sample data
INSERT INTO graduates (full_name, date_of_birth, promotion, track, university, additional_info) VALUES
('Sophie Martin', '2005-03-15', 2024, 'Science Maths', 'Université Pierre et Marie Curie', 'Bourse d''excellence scientifique'),
('Thomas Dupont', '2005-07-22', 2024, 'Science Physique', 'École Polytechnique', 'Mention très bien'),
('Marine Leclerc', '2005-11-08', 2024, 'Science SVT', 'Université de Bordeaux', NULL),
('Lucas Bernard', '2005-05-12', 2024, 'Science Maths', 'École Centrale Paris', 'Premier de sa promotion'),
('Emma Moreau', '2005-09-30', 2024, 'Science Physique', 'Université de Lyon', NULL),
('Maxime Girard', '2005-02-18', 2024, 'Science SVT', 'Université de Toulouse', 'Projet étudiant récompensé'),
('Clara Fontaine', '2005-06-25', 2023, 'Science Maths', 'INSA Lyon', NULL),
('Nicolas Rousseau', '2005-12-03', 2023, 'Science Physique', 'Université de Strasbourg', 'Poursuite en Master Recherche'),
('Amélie Petit', '2005-04-14', 2023, 'Science SVT', 'Université de Montpellier', NULL),
('Hugo Lefevre', '2005-08-27', 2023, 'Science Maths', 'ENSAE Paris', NULL),
('Lucie Durand', '2005-01-09', 2023, 'Science Physique', 'Université de Grenoble', NULL),
('Gabriel Mercier', '2005-10-16', 2023, 'Science SVT', 'Université de Nantes', 'Stage en recherche pharmaceutique');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_graduates_updated_at
BEFORE UPDATE ON graduates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
