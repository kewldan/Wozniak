// Command jobrun wraps a job command, reports its start and finish to the
// server and exits with the command's own exit code.
package main

import (
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"

	"github.com/google/uuid"
)

const usage = "Usage: jobrun <job-id> -- <command> [args...]\n\n" +
	"Set WOZNIAK_URL and WOZNIAK_TOKEN in the environment.\n" +
	"Exit status 2 indicates incorrect usage.\n"

type invocation struct {
	jobID   string
	command []string
}

var jobIDPattern = regexp.MustCompile(`^[a-z0-9][a-z0-9_-]{0,62}$`)

func parseArgs(args []string) (invocation, error) {
	if len(args) < 3 || args[1] != "--" || args[2] == "" {
		return invocation{}, fmt.Errorf("expected a job ID and a command separated by --")
	}
	if !jobIDPattern.MatchString(args[0]) {
		return invocation{}, fmt.Errorf("invalid job ID %q: expected [a-z0-9][a-z0-9_-]{0,62}", args[0])
	}
	// Keep the executable and its arguments as separate strings after "--".
	return invocation{jobID: args[0], command: args[2:]}, nil
}

type runConfig struct {
	invocation
	serverURL string
	token     string
	runID     string
}

func prepareRun(inv invocation, getenv func(string) string) (runConfig, error) {
	// Read the settings the wrapper will use to send events to the server.
	cfg := runConfig{invocation: inv, serverURL: getenv("WOZNIAK_URL"), token: getenv("WOZNIAK_TOKEN")}
	var missing []string
	if strings.TrimSpace(cfg.serverURL) == "" {
		missing = append(missing, "WOZNIAK_URL")
	}
	if strings.TrimSpace(cfg.token) == "" {
		missing = append(missing, "WOZNIAK_TOKEN")
	}
	if len(missing) > 0 {
		return runConfig{}, fmt.Errorf("missing environment variables: %s", strings.Join(missing, ", "))
	}
	id, err := uuid.NewV7()
	if err != nil {
		return runConfig{}, fmt.Errorf("generate run ID: %w", err)
	}
	cfg.runID = id.String()
	return cfg, nil
}

func main() {
	// Skip the program name and use run's result as the process exit code.
	os.Exit(run(os.Args[1:], os.Getenv, os.Stdout, os.Stderr))
}

func run(args []string, getenv func(string) string, stdout, stderr io.Writer) int {
	if len(args) == 1 && (args[0] == "--help" || args[0] == "-h") {
		if _, err := fmt.Fprint(stdout, usage); err != nil {
			_, _ = fmt.Fprintf(stderr, "jobrun: write help: %v\n", err)
			return 1
		}
		return 0
	}
	inv, err := parseArgs(args)
	if err != nil {
		// A failed diagnostic must not replace the usage exit code.
		_, _ = fmt.Fprintf(stderr, "jobrun: %v\n%s", err, usage)
		return 2
	}
	cfg, err := prepareRun(inv, getenv)
	if err != nil {
		_, _ = fmt.Fprintf(stderr, "jobrun: %v\n", err)
		return 1
	}
	// The CLI currently stops after preparation. Execution is tracked in #15.
	if _, err := fmt.Fprintf(stdout, "jobrun: prepared job %q with run ID %s\n", cfg.jobID, cfg.runID); err != nil {
		_, _ = fmt.Fprintf(stderr, "jobrun: write run information: %v\n", err)
		return 1
	}
	return 0
}
