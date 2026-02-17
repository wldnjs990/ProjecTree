DROP TRIGGER IF EXISTS trg_auto_identifier_on_tree ON node_tree;

CREATE TRIGGER trg_auto_identifier_on_tree
    AFTER INSERT ON node_tree
    FOR EACH ROW
    EXECUTE FUNCTION generate_identifier_from_closure();