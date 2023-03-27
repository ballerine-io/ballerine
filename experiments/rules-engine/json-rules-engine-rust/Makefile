install-requirements:
	@rustup component add clippy-preview || true
	@cargo install cargo-outdated || true
	@cargo install cargo-all-features || true
	@cargo install cargo-udeps || true

check:
	@cargo check-all-features
	@cargo +nightly fmt
	@cargo clippy
	@cargo +nightly udeps --all-targets
	@cargo outdated -wR
	@cargo update --dry-run

test:
	@echo -e '\e[1;31mTest in all different combination of features...\e[0m'
	@cargo test-all-features -- --report-time -Z unstable-options
